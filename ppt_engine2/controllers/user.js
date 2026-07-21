import { nanoid } from "nanoid";
import { getUser, addUser, getUserByEmail, getUserCredits } from "../services/user.js";
import { sendSuccess, sendError } from "../utils/response.js";


export const getUserController = async (req, res) => {
    try {
        const user = await getUser(req.user.id);
        return sendSuccess(res, user);
    } catch (error) {
        console.error(error);
        return sendError(res, "Error occurred while fetching user", error, 500);
    }
}

export const addUserController = async (req, res) => {
    try {
        const { name, email, profile, author_name } = req.body;
        if (!name || !email || !profile) {
            return sendError(res, "Required fields are missing", null, 400);
        }
        const existingUser = await getUserByEmail({ email });
        if (existingUser.length > 0) {
            console.log(existingUser);

            return sendSuccess(res, { ...existingUser[0] });
        }
        if (!author_name) author_name = name;
        const user_id = nanoid(10);
        const user = await addUser({ user_id, name, email, profile, author_name });
        return sendSuccess(res, { ...user });
    } catch (error) {
        console.error(error);
        return sendError(res, "Error occurred while adding user", error, 500);
    }
}

export const getUserCreditsController = async (req, res) => {
    try {
        const credits = await getUserCredits({ user_id: req.user.userId });
        return sendSuccess(res, { credits });
    } catch (error) {
        console.error("Fetch credits error:", error);
        return sendError(res, "Error occurred while fetching credits", error, 500);
    }
}