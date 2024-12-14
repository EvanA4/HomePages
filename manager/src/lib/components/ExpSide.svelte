<script lang="ts">
	import { PostExp } from "$lib/actions/expActions";
	import type { Exp, NewExp } from "$lib/types/types";

	let {
		toHide = $bindable(true),
		newTitle = $bindable(""),
		newLink = $bindable(""),
		newTimeperiod = $bindable(""),
		newBullets = $bindable(""),
		refreshExps
	} = $props<{toHide: boolean, newTitle: string, newLink: string, newTimeperiod: string, newBullets: string, refreshExps: () => Promise<void>}>()

	async function handlePost() {
		if (!(newTitle == "" || newTimeperiod == "" || newBullets == "")) {
			let newExp: NewExp = {
				title: $state.snapshot(newTitle),
				link: $state.snapshot(newLink),
				timeperiod: $state.snapshot(newTimeperiod),
				bullets: $state.snapshot(newBullets),
			};

			let result = await PostExp(newExp);
			await refreshExps();
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
				type="text" placeholder="Title of Your Experience"
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
			
			<!-- Time Period -->
			<input 
				type="text" placeholder="Time Period"
				bind:value={newTimeperiod}
				class={
					"bg-black border border-neutral-600 focus:border-blue-400 text-white placeholder-neutral-300 "
					+ "w-[100%] h-[40px] p-3 mt-5 outline-none rounded-lg resize-none scrollbar-none"
				}
			>
			<p class="text-neutral-400 px-3">^ This is Stored Verbatim</p>
			
			<!-- Bullets -->
			<textarea
				placeholder="Bullets"
				bind:value={newBullets}
				class={
					"bg-black border border-neutral-600 focus:border-blue-400 text-white placeholder-neutral-300 "
					+ "w-[100%] h-[40vh] p-3 mt-5 font-mono outline-none rounded-lg resize-none scrollbar-none text-nowrap"
				}
			></textarea>
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