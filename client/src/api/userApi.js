import api from "./apiInstance";

export const fetchUserProfile = async () => {
    const {data} = await api.get('/users/profile', )
    return data
}

export const fetchAllUsers = async ()=>{
    const {data} = await api.get('/users/profiles')
    return data
}

export const updateProfile = async () => {
    const {data} = await api.put('/users/profile' )
    return data
}

export const deleteProfile = async () => {
    const {data} = await api.delete('/users/profile' )
    return data
}
