import type { BlogRow, Blog } from "$lib/types/types"
import { toSQLDate } from "$lib/utils/sqlDate"


export async function GetBlogs(title: string, strict: boolean = false): Promise<Blog[]> {
    // get raw SQL rows for each blog
    let res = await fetch('/api/blogs?' + new URLSearchParams({
        title: title,
        strict: (strict ? "true" : "false")
    }).toString(), {
        cache: "no-cache"
    });
    let rows: BlogRow[] = await res.json();
    let blogs: Blog[] = [];

    // simplify and convert each row into a blog object
    for (let i = 0; i < rows.length; ++i) {
        let newTime = rows[i].postdate.replaceAll('T', ' ').split('.')[0];
        let t: any = newTime.split(/[- :]/);
        let dateObj = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
        let options: any = { year: 'numeric', month: 'long', day: 'numeric' };
        let finalStr = dateObj.toLocaleDateString("en-US", options);
        
        let blog: Blog = {
            title: rows[i].title,
            summary: rows[i].summary,
            content: rows[i].content,
            postdate: finalStr,
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


export async function PostBlog(blog: Blog): Promise<boolean> {
    // delete blog if already exists
    let blogCheck = await GetBlogs(blog.title, true);
    if (blogCheck.length > 0) {
        console.log("Warning: blog already exists, replacing existing blog.");
        await DeleteBlog(blog.title);
    }

    // determine proper SQL TimeStamp string
    let sqlStr = "";
    if (blog.postdate != "") sqlStr = toSQLDate(blog.postdate);

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
            postdate: sqlStr
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