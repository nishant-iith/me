export interface HashnodeTag {
    name: string;
    slug: string;
}

export interface HashnodePost {
    id: string;
    slug: string;
    title: string;
    brief: string;
    publishedAt: string;
    readTimeInMinutes: number;
    tags: HashnodeTag[];
    coverImage: {
        url: string;
    } | null;
    content: {
        html: string;
    };
}
