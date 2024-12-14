<script lang="ts">
	import { PostBlog } from "$lib/actions/blogActions";
	import type { Blog } from "$lib/types/types";

	let {
		toHide = $bindable(true),
		newTitle = $bindable(""),
		newSummary = $bindable(""),
		newContent = $bindable(""),
		newPostdate = $bindable(""),
		refreshBlogs
	} = $props<{toHide: boolean, newTitle: string, newSummary: string, newContent: string, newPostdate: string, refreshBlogs: () => Promise<void>}>()

	async function handlePost() {
		if (!(newTitle == "" || newSummary == "" || newContent == "")) {
			let newBlog: Blog = {
				title: $state.snapshot(newTitle),
				summary: $state.snapshot(newSummary),
				content: $state.snapshot(newContent),
				postdate: $state.snapshot(newPostdate),
			};

			let result = await PostBlog(newBlog);
			await refreshBlogs();
		}
	}
</script>


<div
	class={"z-40 transition-width ease-in duration-500 fixed top-[50px] left-0 overflow-hidden " + (toHide ? "w-0" : "w-[50vw]")}
>
	<div class="h-[100vh] overflow-hidden w-[50vw] border-r-2 border-neutral-800 bg-neutral-900 px-5 flex flex-col py-5 justify-between">
		<div>
			<!-- Title -->
			<input 
				type="text" placeholder="Title of Your Blog"
				bind:value={newTitle}
				class={
					"text-white border-neutral-600 focus:border-blue-400 placeholder-neutral-300 " +
					"block bg-transparent border-b-[1px] text-3xl focus:outline-none h-[50px] w-full"
				}
			>
			
			<!-- Description -->
			<textarea
				placeholder="Description"
				bind:value={newSummary}
				class={
					"border-neutral-600 focus:border-blue-400 text-white placeholder-neutral-300 bg-black "
					+ "w-[100%] mt-5 p-3 block rounded-xl border h-[100px] resize-none outline-none"
				}
			></textarea>

			<!-- Content -->
			<textarea
				placeholder="Content"
				bind:value={newContent}
				class={
					"bg-black border border-neutral-600 focus:border-blue-400 text-white placeholder-neutral-300 "
					+ "w-[100%] h-[40vh] p-3 mt-5 font-mono outline-none rounded-lg resize-none scrollbar-none text-nowrap"
				}
			></textarea>

			<!-- Posted -->
			<input 
				type="text" placeholder="Date Posted"
				bind:value={newPostdate}
				class={
					"bg-black border border-neutral-600 focus:border-blue-400 text-white placeholder-neutral-300 "
					+ "w-[100%] h-[40px] p-3 mt-5 outline-none rounded-lg resize-none scrollbar-none"
				}
			>
			<p class="text-neutral-400 px-3">^ Leave Empty for New Blogs</p>
		</div>
	
		<div class="flex gap-10">
			<button onclick={async () => {
				handlePost()
			}} class='bg-blue-500 hover:bg-blue-400 text-white px-7 py-3 rounded-[10px] w-min mb-[80px]'>POST</button>
			<button
				onclick={() => {
					toHide = true;
				}}
				class='bg-red-500 hover:bg-red-400 text-white px-7 py-3 rounded-[10px] w-min mb-[80px]'
			>CANCEL</button>
		</div>
	</div>
</div>