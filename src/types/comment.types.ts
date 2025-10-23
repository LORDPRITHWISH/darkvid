// /home/darklord/Desktop/Code_Sync/darkvid/src/types/comment.types.ts

import type { ApiResponse } from "./api.types"

export interface UserRef {
  _id: string;
  username: string;
  email: string;
  profilepic?: string;
}

export interface Comments {
    _id: string
    content: string
    createdAt: string // ISO date string
    likes: number
    replies: Comments[] // nested replies (can be empty)
    replyCount: number
    user: UserRef
}

/**
 * Input used when creating a new comment/reply
 */
export interface NewCommentInput {
    content: string
    userId: string
    parentId?: string // present when creating a reply
}

// export type Comments = Comment[]
export type CommentsResponse = ApiResponse<Comments[]>;