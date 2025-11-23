import { BaseContext } from '@apollo/server';
import { IResolvers } from '@graphql-tools/utils';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

export type UploadedFile = Promise<FileUpload>;

export type User = {
    id?: string;
    email: string;
    password: string;
    name: string;
    avatar?: string
    createdAt?:number
    updateAt?:number
    events?: Event[];
    bookedSlots: number;
    bookings: Booking[]
    isVerified?: Boolean
};

export interface authUser extends BaseContext {
    payload : {
        id: string;
    }
    iat?: number
    exp?: number
}

export interface user {
    id: number
    email: string
    name: string
    events: [Event]
    avatar: string
}

export type EventType = {
    id: string
    title: string
    description: string
    location: string
    date: string
    maxSlots: number
    price: number
    user: User;
    bookings: [Booking]
    bookedSlots: number
    eventImages: [string]
    category: string
    userId : string
}

export type Booking = {
    id: string
    userId: string
    eventId: string
    event:Event
    user: user
}

export type CreateEventInput = {
    title: string
    description: string
    location: string
    date: string
    userId: string
    maxSlots: number
    price: number
    category:string
    startAt:string 
    endAt:string
    userEmial:string
}

export type UpdateEventInput = {
    id: string
    title: string
    description: string
    location: string
    date: string
}

export type SignUpInput = {
    email: string
    password: string
    name: string
    }

  export type LoginInput = {
    email: string
    password: string
  }

  type LogoutResponse = {
    message: string
  }