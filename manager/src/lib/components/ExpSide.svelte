<script lang="ts">
	import { PostExp } from "$lib/actions/expActions";
	import type { ExpFormSQL } from "$lib/types/types";

	let {
		toHide = $bindable(true),
		newTitle = $bindable(""),
		newLink = $bindable(""),
		newStartTime = $bindable(""),
		newEndTime = $bindable(""),
		newBullets = $bindable(""),
		refreshExps
	} = $props<{toHide: boolean, newTitle: string, newLink: string, newStartTime: string, newEndTime: string, newBullets: string, refreshExps: () => Promise<void>}>()

	async function handlePost() {
		let newExp: ExpFormSQL = {
			title: $state.snapshot(newTitle),
			link: $state.snapshot(newLink),
			startTime: $state.snapshot(newStartTime),
			endTime: $state.snapshot(newEndTime),
			bullets: $state.snapshot(newBullets),
		};

		let result = await PostExp(newExp);
		await refreshExps();
	}

/*
[
	"exp1 bullet1",
	"exp2 bullet2",
	"exp3 bullet3"
]
*/	
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
			<p class="text-neutral-400 px-3">^ Can Be Empty</p>
			
			<!-- Start Time -->
			<input 
				type="text" placeholder="Start Date"
				bind:value={newStartTime}
				class={
					"bg-black border border-neutral-600 focus:border-blue-400 text-white placeholder-neutral-300 "
					+ "w-[100%] h-[40px] p-3 mt-5 outline-none rounded-lg resize-none scrollbar-none"
				}
			>

			<!-- End Time -->
			<input 
				type="text" placeholder="End Date"
				bind:value={newEndTime}
				class={
					"bg-black border border-neutral-600 focus:border-blue-400 text-white placeholder-neutral-300 "
					+ "w-[100%] h-[40px] p-3 mt-5 outline-none rounded-lg resize-none scrollbar-none"
				}
			>
			<p class="text-neutral-400 px-3">^ Leave Empty If Experience Hasn't Concluded</p>
			
			<!-- Bullets -->
			<textarea
				placeholder="Bullets"
				bind:value={newBullets}
				class={
					"bg-black border border-neutral-600 focus:border-blue-400 text-white placeholder-neutral-300 "
					+ "w-[100%] h-[30vh] p-3 mt-5 font-mono outline-none rounded-lg resize-none scrollbar-none text-nowrap"
				}
			></textarea>
			<p class="text-neutral-400 px-3">^ Can Be Empty</p>
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