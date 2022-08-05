import mongoose from "mongoose";

export type TCardType = {
  name: string;
  link: string;
  owner: mongoose.Schema.Types.ObjectId;
  likes: Array<mongoose.Schema.Types.ObjectId | null>;
  createdAt: Date;
}

export type TUserType = {
  name: string;
  about: string;
  avatar: string;
}