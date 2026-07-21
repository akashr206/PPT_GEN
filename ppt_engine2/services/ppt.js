import { supabase } from "../utils/getClient.js";

export const createPPT = async ({ ppt_id, user_id, title, author, theme, slides, tone, slides_count, status }) => {
    const { data, error } = await supabase
        .from('ppts')
        .insert([
            { id: ppt_id, user_id, title, author, theme, slides, tone, slides_count, status }
        ])
    if (error) {
        throw error;
    }
    return data;
}

export const addPPTContent = async ({ ppt_id, title, author, theme, slides, tone, slides_count, status }) => {
    const { data, error } = await supabase
        .from("ppts")
        .update({
            title,
            author,
            theme,
            slides,
            tone,
            slides_count,
            status
        })
        .eq("id", ppt_id)
    if (error) {
        throw error;
    }
    return data;
}

export const initPPT = async ({ ppt_id, userId }) => {
    const { data, error } = await supabase
        .from("ppts")
        .upsert(
            { id: ppt_id, user_id: userId, status: "GENERATING" },
            { onConflict: 'id' }
        )
    if (error) {
        throw error;
    }
    return data;
}

export const updateStatus = async ({ ppt_id, status }) => {
    const { data, error } = await supabase
        .from('ppts')
        .update({ status })
        .eq('id', ppt_id)
    if (error) {
        throw error;
    }
    return data;
}

export const deletePPTById = async ({ ppt_id }) => {
    const { data, error } = await supabase
        .from('ppts')
        .delete()
        .eq('id', ppt_id)
    if (error) {
        throw error;
    }
    return data;
}

export const updateTheme = async ({ ppt_id, theme }) => {
    const { data, error } = await supabase
        .from('ppts')
        .update({ theme })
        .eq('id', ppt_id)
    if (error) {
        throw error;
    }
    return data;
}

export const readStatus = async ({ ppt_id }) => {
    const { data, error } = await supabase
        .from('ppts')
        .select('status')
        .eq('id', ppt_id)
    if (error) {
        throw error;
    }
    return data;
}

export const updateSlides = async ({ ppt_id, slides }) => {
    const { data, error } = await supabase
        .from('ppts')
        .update({ slides })
        .eq('id', ppt_id)
    if (error) {
        throw error;
    }
    return data;
}

export const getUserPpts = async ({ user_id }) => {
    const { data, error } = await supabase
        .from('ppts_summary')
        .select('*')
        .eq('user_id', user_id)
        .eq('status', 'SUCCESS')
        .order('created_at', { ascending: false });
    if (error) {
        throw error;
    }
    return data;
}

export const fetchPPTById = async ({ ppt_id }) => {
    const { data, error } = await supabase
        .from('ppts')
        .select('*')
        .eq('id', ppt_id)
    if (error) {
        throw error;
    }
    return data;
}

export const updateShareStatus = async ({ ppt_id, is_shared }) => {
    const { data, error } = await supabase
        .from('ppts')
        .update({ is_shared })
        .eq('id', ppt_id)
        .select();
    if (error) {
        throw error;
    }
    return data;
}

export const getSharedPPTById = async ({ ppt_id }) => {
    const { data, error } = await supabase
        .from('ppts')
        .select('id, title, theme, slides, created_at, user_id, is_shared')
        .eq('id', ppt_id)
        .eq('is_shared', true)
        .single();
    if (error) {
        throw error;
    }
    return data;
}