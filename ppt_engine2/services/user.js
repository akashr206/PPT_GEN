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
        ]).select().single();

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

export const getUserCredits = async ({ user_id }) => {
    const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user_id)
        .single();
        
    if (error) {
        throw error;
    }
    return data?.credits || 0;
}

export const updateCredits = async ({ user_id, amount_to_add }) => {
    // First fetch current credits to avoid completely overwriting without knowing the balance
    const currentCredits = await getUserCredits({ user_id });
    const newCredits = currentCredits + amount_to_add;

    const { data, error } = await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', user_id)
        .select('credits')
        .single();

    if (error) {
        throw error;
    }
    return data?.credits;
}
