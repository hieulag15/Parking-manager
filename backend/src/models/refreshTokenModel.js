import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
const REFRESHTOKEN_COLECTION_NAME = 'refreshToken';

const refreshTokenSchema = new mongoose.Schema(
  {
    refreshtoken: { type: String, required: true },
    personId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);
const refreshToken = mongoose.model(REFRESHTOKEN_COLECTION_NAME, refreshTokenSchema);

const findRefreshToken = async (refreshtoken, personId) => {
    try {
        const findToken = await refreshToken.findOne({
            refreshtoken,
            personId: new ObjectId(personId),
        });
        return findToken;
    } catch (error) {
        throw new Error(error.message);
    }
};

const createRefreshToken = async (refreshtoken, personId) => {
    try {
        const newRefreshToken = new refreshToken({
            refreshtoken,
            personId: new ObjectId(personId),
        });
        const createToken = await newRefreshToken.save();
        return createToken;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteRefreshToken = async (refreshToken) => {
    try {
        const deleteToken = await refreshToken.delete({ refreshtoken: refreshToken });
        return deleteToken;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const refreshTokenModel = {
    findRefreshToken,
    createRefreshToken,
    deleteRefreshToken,
}
