import { supabase } from "../utils/getClient.js";


export const getUser = async ({ user_id }) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id)
    if (error) {
        throw error;
    }
    return data;
}

export const getUserByEmail = async ({ email }) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
    if (error) {
        throw error;
    }
    return data;
}

export const addUser = async ({
    user_id,
    name,
    email,
    profile,
    author_name
}) => {
    const p_name = author_name;
    const image = profile;
    const id = user_id

    const { data, error } = await supabase
        .from('users')
        .insert([
            {
                id,
                name,
                email,
                p_name,
                image
            }
        ]);

    if (error) {
        throw error;
    }

    return data;
}

export const deleteUser = async ({ user_id }) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', user_id)
    if (error) {
        throw error;
    }
    return data;
}
