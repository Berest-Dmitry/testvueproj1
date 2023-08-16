export default{
    //requestSettings: {
        defaultSiteUrl: 'https://localhost:7175',
        getMethodAsync: async function(url: any, headers: any, callback: any){
            await fetch(url, {
                method: "GET",
                headers: headers
            })
            .then(async (response) => await callback(response));
        },
        postMethodAsync: async function(url: any, headers: any, body: any, callback: any){
            await fetch(url, {
                method: "Post",
                headers: headers,
                body: body
            })
            .then(async (response) => await callback(response));
        },
        deleteMethodAsync: async function(url: any, headers: any, callback: any){
            await fetch(url, {
                method: "DELETE",
                headers: headers
            })
            .then(async (response) => await callback(response));
        }
   // }
}