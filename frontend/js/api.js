const BASE_URL = "https://knowledge-tracker.onrender.com";

const loginuser = async(credentials) =>{
    const res = await fetch(`${BASE_URL}/auth/login`,{
        method : "POST",
        credentials: "include",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(credentials),
    });

    if (!res.ok){
        throw await res.json();
    }
    return res.json();
}


const registeruser  = async (credentials) =>{
    const res = await fetch(`${BASE_URL}/auth/register`,{
        method : "POST",
        credentials: "include", 
        headers:{
            "Content-Type" : "application/json"},
            body : JSON.stringify(credentials),
    });
    if (!res.ok){
        throw await res.json();
    }
    return res.json();
}

const checkauth = async() =>{
    const res = await fetch(`${BASE_URL}/me`,{
        method: "GET",
        credentials: "include",
    });
    if (!res.ok){
        throw await res.json();
    }
    return res.json();
}

const createKnowledgeUnit = async(data)=>{
    const res= await fetch(`${BASE_URL}/knowledge/add`,{
      method:"POST",
      credentials :"include",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)});

      if(!res.ok){
        throw await res.json();
      }
      return res.json(
    )
}

const deleteKnowledgeUnit = async(id)=>{
    const res = await fetch(`${BASE_URL}/knowledge/del/${id}`,{
        method:"DELETE",
        credentials:"include",
        headers:{
            "Content-Type" : "application/json"
        }
    });

    if (!res.ok){
        throw await res.json();
    }
    return res.json();
}

const updateKnowledgeUnit = async(id, data) =>{
    const res = await fetch(`${BASE_URL}/knowledge/${id}`,{
        method:"PATCH",
        credentials : "include",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok){
        throw await res.json();
    }
    return res.json();
}

const getAllKnowledgeUnits = async() =>{
    const res = await fetch(`${BASE_URL}/knowledge/all`,{
        method:"GET",
        credentials:"include",
        headers:{
            "Content-Type" : "application/json"
        }
    });

    if (!res.ok){
        throw await res.json();
    }
    return res.json();
}

const logoutUser = async() =>{
    const res = await fetch(`${BASE_URL}/auth/logout`,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type" : "application/json"
        }
    });

    if (!res.ok){
        throw await res.json();
    }
    return res.json();
}
