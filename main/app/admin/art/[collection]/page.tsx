import React, { use } from 'react'

export default function ({
  params,
}: {
  params: Promise<{ collection: string }>
}) {
    const blogTitle = (use(params) as { collection: string }).collection.replaceAll("%2B", " ");

    return (
        <div>
            {blogTitle}
        </div>
    )
}
