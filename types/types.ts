export interface User {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    deathDate: string;
    profileImages: string;
    biography: string[];
    story: string[];
    mediaGallery: string[];
}

export interface Media {
    id: string;
    uid: string;
    message: string;
    media: string;
}

export interface Bio {
    id: string;
    uid: string;
    title: string;
    content: string;
    image: string;
}

export interface Story {
    id: string;
    uid: string;
    title: string;
    content: string;
    type: string;
}

export interface FullUser {
    user: User;
    media: Media[];
    bio: Bio[];
    story: Story[];
}