<script lang="ts">
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import BlogSide from '$lib/components/BlogSide.svelte';
	import BlogImg from '$lib/public/blogs.png';
	import TrashImg from '$lib/public/wtrash.svg';
	import CheckImg from '$lib/public/wcheck.svg';
  	import type { Blog } from '$lib/types/types';
  	import { DeleteBlog, GetBlogs } from '$lib/actions/blogActions';


	let blogs = $state<Blog[]>([]);
	let searchText = $state<string>("");
	let deleteConfirm = $state<string>("");
	let hideSidePage = $state<boolean>(true);
	let newTitle = $state<string>("");
	let newSummary = $state<string>("");
	let newContent = $state<string>("");
	let newPostdate = $state<string>("");


	async function refreshBlogs() {
		blogs = await GetBlogs("")
	}
	

	onMount(async () => {
		blogs = await GetBlogs("")
	})
</script>


<div class="relative">
	<Navbar />
	<BlogSide bind:toHide={hideSidePage} bind:newTitle={newTitle} bind:newSummary={newSummary} bind:newContent={newContent} bind:newPostdate={newPostdate} refreshBlogs={refreshBlogs}/>

	<div class='w-[100%] my-[4vh] flex flex-col justify-center items-center p-3 relative'>
		<img src={BlogImg} alt="blog display">
		<p class='text-neutral-200 mt-5'>Welcome to the blogs page!</p>

		<div class='absolute left-0 bottom-[10vh] rotate-[30deg] z-0 w-[48vw] min-w-[200px] h-[14vh] -ml-[28vh] rounded-full blur-[10vh] bg-green-800'></div>
		<div class='absolute left-0 bottom-0 rotate-[30deg] z-0 w-[20vw] h-[10vh] -ml-[7vh] rounded-full blur-[7vh] bg-green-600'></div>
	</div>


	<div class='p-3 w-[100%] flex gap-3 justify-center static'>
		<input type="text" bind:value={searchText} placeholder='Search or scroll!' class='w-[60vw] rounded-full py-3 px-4 text-black z-10'/>
		<button onclick={async () => {
			blogs = await GetBlogs(searchText)
		}} class='bg-blue-500 hover:bg-blue-400 text-white px-3 rounded-[10px]'>Search</button>
		<button
			id="openBtn"
			onclick={() => {
				newTitle = ""
				newSummary = ""
				newContent = ""
				newPostdate = ""
				if (hideSidePage) hideSidePage = false;
			}}
			class='bg-green-500 hover:bg-green-400 text-white px-3 rounded-[10px]'
		>New Blog</button>
	</div>

	<div class='flex flex-col gap-[25px] w-[100%] justify-center items-center px-5 pb-[50px] pt-[50px]'>
		{#each blogs as blog}
			<div class="w-[100%] relative">
				<button
					id="openBtn"
					onclick={async () => {
						newTitle = blog.title
						newSummary = blog.summary
						newContent = blog.content
						newPostdate = blog.postdate
						if (hideSidePage) hideSidePage = false;
					}}
					class='z-20 text-start text-white p-3 border-white border-2 rounded-[15px] bg-black w-[100%]'
				>
					<div class="w-[80%]">
						<p id="openBtn" class='text-lg'><b>{blog.title}</b></p>
						<p id="openBtn" class='text-neutral-300'>{blog.postdate}</p>
						<br id="openBtn"/>
						<p id="openBtn">{blog.summary}</p>
					</div>
	
				</button>
				<button onclick={async () => {
					if (deleteConfirm == blog.title) {
						deleteConfirm = ""
						await DeleteBlog(blog.title)
						await refreshBlogs()
					} else {
						deleteConfirm = blog.title
					}
				}} class="absolute top-[50%] right-[20px] -translate-x-[50%] -translate-y-[50%] h-[35px] w-[35px] opacity-70 hover:opacity-100">
					{#if deleteConfirm == blog.title}
						<img src={CheckImg} alt="A Check Mark">
					{:else}
						<img src={TrashImg} alt="A Trash Can">
					{/if}
				</button>
			</div>
		{/each}
		{#if blogs.length == 0}
			<p class='text-neutral-300 text-3xl'>No Results</p>
		{/if}
	</div>
</div>