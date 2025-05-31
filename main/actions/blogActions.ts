'use server';

import type { BlogType } from "@/types/types"
import { Blog } from "@/public/models/blog";
import { ActionResult } from "@/types/actionResult";


export async function actionGetBlogs(): Promise<ActionResult<BlogType[]>> {
    let blogs: BlogType[] = (await Blog.findAll({
        order: [
            ['postdate', 'DESC'],
        ],
        attributes: {
            exclude: ["content"]
        }
    })).map(x => x.dataValues);
    return {
        error: false,
        message: "successfully retrieved blogs",
        data: blogs
    };
}


export async function actionGetBlogByTitle(title: string): Promise<ActionResult<BlogType>> {
    let blogs: BlogType = (await Blog.findOne({ where: { title: title } }))?.dataValues;
    return {
        error: false,
        message: "successfully retrieved blogs",
        data: blogs
    };
}


export async function actionUpdateBlog(searchTitle: string, newBlog: BlogType): Promise<ActionResult<boolean>> {
    await Blog.update(newBlog, { where: { title: searchTitle } });
    return {
        error: false,
        message: "successfully retrieved blogs",
        data: true
    };
}


export async function actionCreateBlog(newBlog: BlogType): Promise<ActionResult<BlogType>> {
    const res: BlogType = (await Blog.create(newBlog)).dataValues;
    return {
        error: false,
        message: "successfully retrieved blogs",
        data: res
    };
}

export async function actionDeleteBlog(blog: BlogType): Promise<ActionResult<boolean>> {
    await Blog.destroy({ where: { title: blog.title } });
    return {
        error: false,
        message: "successfully retrieved blogs",
        data: true
    };
}