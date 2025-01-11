import type { BlogType } from "$lib/types/types"
import { fromSQLDate } from "$lib/utils/sqlDate"


export async function GetBlogs(title: string, strict: boolean = false): Promise<BlogType[]> {
    // get raw SQL rows for each blog
    let res = await fetch('/api/blogs?' + new URLSearchParams({
        title: title,
        strict: (strict ? "true" : "false")
    }).toString(), {
        cache: "no-cache"
    });
    let rows: BlogType[] = await res.json();
    let blogs: BlogType[] = [];

    // simplify and convert each row into a blog object
    for (let i = 0; i < rows.length; ++i) {
        let blog: BlogType = {
            title: rows[i].title,
            summary: rows[i].summary,
            content: rows[i].content,
            postdate: fromSQLDate(rows[i].postdate),
        };

        blogs.push(blog);
    }

    return blogs;
}


export async function DeleteBlog(title: string): Promise<boolean> {
    // make DELETE request
    let res = await fetch('/api/blogs?' + new URLSearchParams({
        title: title
    }).toString(), {
        method: "DELETE",
        cache: "no-cache"
    });

    // return success or failure
    let rawres = await res.json();
    if (!rawres) {
        console.log(`Error: failed to delete blog \"${title}\".`);
        return false;
    }
    return true;
}


export async function PostBlog(blog: BlogType): Promise<boolean> {
    // delete blog if already exists
    let blogCheck = await GetBlogs(blog.title, true);
    if (blogCheck.length > 0) {
        console.log("Warning: blog already exists, replacing existing blog.");
        await DeleteBlog(blog.title);
    }

    blog.content = blog.content.replace(/\t/g,'\\t');
    blog.content = blog.content.replace(/\n/g,'\\n');
    blog.content = blog.content.replace(/\"/g,'\\\"');

    // make actual POST request
    let res = await fetch("/api/blogs", {
        method: "POST",
        body: JSON.stringify({
            title: blog.title,
            summary: blog.summary,
            content: blog.content,
            postdate: blog.postdate
        }),
        cache: "no-cache"
    });

    // return success or failure
    let rawres = await res.json();
    if (!rawres) {
        console.log(`Error: failed to post blog \"${blog.title}\".`);
        return false;
    }
    return true;
}