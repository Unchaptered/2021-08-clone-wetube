import userConstructor from "../models/User";
import videoConstructor from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const rootGetJoinUser=(req,res)=>{
    res.render(`users/accountcreate`, { pageTitle: `Create Account` });
}
export const rootPostJoinUser=async(req,res)=>{
    // hi
    const { name, email, username, password, location, }=req.body;
    const pageTitle="Join";
    const exists=await userConstructor.exists({$or: [{username},{email}]});
    if(exists) {
        return res.render("users/accountcreate", {
            pageTitle,
            errorMessage: "This username/email is already defined",
        })
    };
    await userConstructor.create({
        name,
        email,
        username,
        password,
        location,
    });
    return res.redirect("/login");
};

export const rootGetLoginUser=(req,res)=>{
    res.render(`users/accountlogin`, { pageTitle: `Login Account`});
}
export const rootPostLoginUser=async(req,res)=>{
    // check if account exsists
    const { username, password }=req.body;
    const userDB=await userConstructor.findOne({ username, socialOnly: false });
    if (!userDB){
        return res.status(400).render(`users/accountlogin`, {
            pageTitle: `Login`,
            errorMessage: `An account with this username doesn't exists.`,
        });
    }
    const pwCompareToDB=await bcrypt.compare(password,userDB.password);
    if (!pwCompareToDB){
        return res.status(400).render(`users/accountlogin`, {
            pageTitle: `Login`,
            errorMessage: `Wrong password.`,
        });
    }
    req.session.loggedIn=true;
    req.session.user=userDB; 
    return res.redirect(`/`);
}
// client_id=user:email
export const startGitHubLogin=(req,res)=>{
    const config={
        client_id:process.env.OAUTH_GITHUB_CLIENT_ID,
        allow_signup:false,
        scope:`read:user user:email`,
    };
    const params= new URLSearchParams(config).toString();
    const baseUrl=`http://github.com/login/oauth/authorize`;
    const finalUrl=`${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};
export const finishGitHubLogin=async(req,res)=>{
    const config={
        client_id:process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret:process.env.OAUTH_GITHUB_CLIENT_SECRET,
        code: req.query.code,
    };
    const params= new URLSearchParams(config).toString();
    const baseUrl=`http://github.com/login/oauth/access_token`;
    const finalUrl=`${baseUrl}?${params}`;
    // 바닐라js 참고
    const tokenRequest= await (
        await fetch(finalUrl, {
        method:`POST`,
        headers:{
                Accept: `application/json`,
            },
        })
    ).json();

    if(`access_token` in tokenRequest){
        const { access_token }=tokenRequest;
        const apiUrl=`http://api.github.com`;
        // 토큰을 사용해서 userData 와 emailData 호출
        const userData= await (
            await fetch(`${apiUrl}/user`,{
                headers:{
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailData= await (
            await fetch(`${apiUrl}/user/emails`,{
                headers:{
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        // console.log(emailData);

        const emailObj=emailData.find(
            (email) => email.primary === true && email.verified === true,
        );
        if(!emailObj){ // Notification and Error
            return res.redirect(`/login`);
        }

        const userDB=await userConstructor.findOne({email: emailObj.email});
        if(!userDB){
            const user=await userConstructor.create({
                name:userData.name,
                email:emailObj.email,
                username:userData.login,
                password:"",
                socialOnly: true,
                avatarUrl: userData.avartar_url,
                location:userData.location,
            });
        }
        req.session.loggedIn=true;
        req.session.user=userDB;
        return res.redirect(`/`);
    } else {
        return res.redirect(`/login`);
    }
};

// logout
export const logoutUser=(req,res)=>{
    req.session.destroy();

    return res.redirect(`/`);
}
// Edit Profile
export const getEditUser=(req,res)=>{
    return res.render(`users/account-edit-profile`, {pageTitle: `Edit Profile`});
}
export const postEditUser=async (req,res)=>{
    const {
        session: { user: { _id,avatarUrl } },
        body: { name,email,username,location },
        file,
    }=req;
    // console.log(file);
    const userExists = await userConstructor.exists({
        _id: { $ne: _id },
        $or: [{ username }, { email }],
    });

    if (userExists) {
        return res.render(`users/account-edit-profile`, {
            pageTitle: `Edit Profile`,
            errorMessage: `This email / username is already taken`
        });
    }

    const userUpdated = await userConstructor.findByIdAndUpdate(_id,
        { name,email,username,location,
        avatarUrl: file ? file.path : avatarUrl },
        { new: true }
    );
    req.session.user = userUpdated;
    return res.redirect(`/`);
}
// Edit Password
export const getEditPassword=(req,res)=>{
    if(req.session.user.socialOnly === true){
        return res.status(400).render(`users/account-edit-password`,
            {
                pageTitle:`Change Password`,
                errorMessage:`SNS Login User don't have Password.`,
            });
    }
    return res.render(`users/account-edit-password`, { pageTitle:`Change Password` });
}
export const postEditPassword=async(req,res)=>{
    const {
        session: { user: { _id, password } },
        body: { name,email,username,location },
    }=req;
    const { oldPassword,newPassword,newPasswordConfirm }=req.body;
    const SessionCompareToDB=await bcrypt.compare(oldPassword,password);
    if(!SessionCompareToDB){
        return res.status(400).render(`users/account-edit-password`,
            {
                pageTitle:`Change Password`,
                errorMessage:`Old Password doesn't maltch the confirmation`,
        });
    }
    if(newPassword!==newPasswordConfirm){
        return res.status(400).render(`users/account-edit-password`,
            {
                pageTitle:`Change Password`,
                errorMessage:`New password doesn't maltch the confirmation`,
        });
    }

    
    const userDB=await userConstructor.findById(_id);
    userDB.password=newPassword;
    await userDB.save();
    req.session.user.password=userDB.password;

    return res.redirect(`/`);
}

export const seeUser=async(req,res)=>{
    const { userID }=req.params;
    const userDB=await userConstructor.findById(userID).populate(`childVideo`);
    // console.log(userDB);
    if(!userDB){
        return res.status(404).render(`404`, {
            pageTitle: `Not Found`
        });
    } else {
        // const videoDB=await videoConstructor.find({ owner: userDB._id });
        return res.render(`users/account-see-profile`, {
            pageTitle: `${userDB.name} 's Profile`,
            userDB,
            // videoDB
        });
    }
}

export const deleteUser=(req,res)=>res.send(`User Delete`);