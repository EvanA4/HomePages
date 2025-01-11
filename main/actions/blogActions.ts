import type { BlogType } from "@/types/types"
import { fromSQLDate } from "@/public/utils/sqlDate";


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