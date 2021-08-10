const fakeUser={
    username:"Nicolas",
};

// Fake DB
const videos=[
    {
        title:"001 Video",
        rating:5,
        comments:31,
        createdAt: "2 minutes ago",
        views:59,
        id:1,
    },
    {
        title:"002 Video",
        rating:5,
        comments:1,
        createdAt: "2 minutes ago",
        views:1,
        id:2,
    },
    {
        title:"003 Video",
        rating:5,
        comments:4,
        createdAt: "2 minutes ago",
        views:5,
        id:3,
    },
];

export const globalHotVideo=(req,res)=>{
    return res.render(`home`, { pageTitle: `Home`, videos}); // name of PUG
}
export const globalSearchVideo=(req,res)=>{
    return res.render(`search`, { pageTitle: 'Search Video'});
}

export const getUploadVideo=(req,res)=>{
    return res.render(`getuploadvideo`, { pageTitle: 'Upload Video'});
}
export const postUploadVideo=(req,res)=>{
    const { title }=req.body;
    const newVideo={
        title: title,
        rating:0,
        comments:0,
        createdAt: "Just Now",
        views:0,
        id:videos.length+1,
    }
    videos.push(newVideo);
    // Here We will add a video to the videos array
    return res.redirect(`/`);
}


export const seeVideo=(req,res)=>{
    const { id } = req.params;
    // const id=req.params.id;
    const video=videos[id-1];
    console.log(`show video ${id}`);
    return res.render(`seevideo`, { pageTitle: `See: ${video.title}`, video});
}
export const getEditVideo=(req,res)=>{
    const { id } = req.params;
    // const id=req.params.id;
    const video=videos[id-1];
    return res.render(`geteditvideo`, { pageTitle: `Editing: ${video.title}`,video});
}
export const postEditVideo=(req,res)=>{
    const { id } = req.params;
    const title= req.body.title;
    videos[id-1].title=title;
    return res.redirect(`/`);
}
export const deleteVideo=(req,res)=>{
    return res.render(`deletevideo`, { pageTitle: `Delete: Vid`});
}