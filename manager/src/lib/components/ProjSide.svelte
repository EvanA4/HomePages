<script lang="ts">
	import { PostProj } from "$lib/actions/projActions";
	import type { NewProject } from "$lib/types/types";

	let {
		toHide = $bindable(true),
		newTitle = $bindable(""),
		newLink = $bindable(""),
		newSummary = $bindable(""),
		newFlags = $bindable(""),
		refreshProjs
	} = $props<{toHide: boolean, newTitle: string, newLink: string, newSummary: string, newFlags: string, refreshProjs: () => Promise<void>}>()

	async function handlePost() {
		if (!(newTitle == "" || newSummary == "")) {
			let newProj: NewProject = {
				title: $state.snapshot(newTitle),
				link: $state.snapshot(newLink),
				summary: $state.snapshot(newSummary),
				flags: $state.snapshot(newFlags),
			};

			let result = await PostProj(newProj);
			await refreshProjs();
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
				type="text" placeholder="Title of Your Project"
				bind:value={newTitle}
				class={
					"text-white border-neutral-600 focus:border-blue-400 placeholder-neutral-300 " +
					"block bg-transparent border-b-[1px] text-3xl focus:outline-none h-[50px] w-full"
				}
			>
			
			<!-- Link -->
			<input 
				type="text" placeholder="Link"
				bind:value={newLink}
				class={
					"bg-black border border-neutral-600 focus:border-blue-400 text-white placeholder-neutral-300 "
					+ "w-[100%] h-[40px] p-3 mt-5 outline-none rounded-lg resize-none scrollbar-none"
				}
			>
			<p class="text-neutral-400 px-3">^ You Can Leave This Empty</p>
			
			<!-- Summary -->
			<textarea
				placeholder="Summary"
				bind:value={newSummary}
				class={
					"bg-black border border-neutral-600 focus:border-blue-400 text-white placeholder-neutral-300 "
					+ "w-[100%] h-[10vh] p-3 mt-5 outline-none rounded-lg resize-none scrollbar-none"
				}
			></textarea>
			
			<!-- Flags -->
			<textarea
				placeholder="Flags"
				bind:value={newFlags}
				class={
					"bg-black border border-neutral-600 focus:border-blue-400 text-white placeholder-neutral-300 "
					+ "w-[100%] h-[40vh] p-3 mt-5 font-mono outline-none rounded-lg resize-none scrollbar-none text-nowrap"
				}
			></textarea>
			<p class="text-neutral-400 px-3">^ Can Also Leave Empty</p>
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