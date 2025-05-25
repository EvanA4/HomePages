import { actionGetBlogs, actionGetBlogByTitle, actionUpdateBlog, actionCreateBlog, actionDeleteBlog } from "@/actions/blogActions";
import { Result } from "@/types/result";
import { BlogType } from "@/types/types";


export async function getBlogs(): Promise<Result<BlogType[]>> {
    const res = await actionGetBlogs();
    if (!res.error && res.data) {
        return new Result<BlogType[]>(res.data, res.message);
    } else {
        return new Result<BlogType[]>(undefined, res.message);
    }
}


export async function getBlogByTitle(title: string): Promise<Result<BlogType>> {
    const res = await actionGetBlogByTitle(title);
    if (!res.error && res.data) {
        return new Result<BlogType>(res.data, res.message);
    } else {
        return new Result<BlogType>(undefined, res.message);
    }
}


export async function updateBlog(blogTitle: string, newBlog: BlogType): Promise<Result<boolean>> {
    const res = await actionUpdateBlog(blogTitle, newBlog);
    if (!res.error && res.data) {
        return new Result<boolean>(res.data, res.message);
    } else {
        return new Result<boolean>(undefined, res.message);
    }
}


export async function createBlog(newBlog: BlogType): Promise<Result<BlogType>> {
    const res = await actionCreateBlog(newBlog);
    if (!res.error && res.data) {
        return new Result<BlogType>(res.data, res.message);
    } else {
        return new Result<BlogType>(undefined, res.message);
    }
}


export async function deleteBlog(blog: BlogType): Promise<Result<boolean>> {
    const res = await actionDeleteBlog(blog);
    if (!res.error && res.data) {
        return new Result<boolean>(res.data, res.message);
    } else {
        return new Result<boolean>(undefined, res.message);
    }
}