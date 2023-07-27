export default{
    //requestSettings: {
        defaultSiteUrl: 'https://localhost:7175',
        getMethodAsync: async function(url, headers, callback){
            await fetch(url, {
                method: "GET",
                headers: headers
            })
            .then(async (response) => await callback(response));
        },
        postMethodAsync: async function(url, headers, body, callback){
            await fetch(url, {
                method: "Post",
                headers: headers,
                body: body
            })
            .then(async (response) => await callback(response));
        }
   // }
}