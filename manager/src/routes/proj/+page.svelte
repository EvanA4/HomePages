<script lang="ts">
  	import { DeleteProj, GetProjs } from '$lib/actions/projActions';
  	import Navbar from '$lib/components/Navbar.svelte';
  	import ProjSide from '$lib/components/ProjSide.svelte';
	import ProjImg from '$lib/public/projects.png';
	import type { Project } from '$lib/types/types';
	import { onMount } from 'svelte';
	import EditImg from "$lib/public/edit.svg";
	import TrashImg from "$lib/public/wtrash.svg";
	import CheckImg from "$lib/public/wcheck.svg";
	

	let hideSidePage = $state(true);
	let confirmDelete = $state("");
	let searchText = $state("");
	let newTitle = $state("");
    let newLink = $state("");
    let newSummary = $state("");
    let newFlags = $state("");
	let projs = $state<Project[]>([]);


	// let proj = {
	// 	title: "HomePages",
	// 	link: "https://github.com/EvanA4/HomePages",
	// 	summary: "My little corner of the internet, a full-stack self-hosted application. Blogs are powered by a MySQL database server, and the site is hosted on my own mini PC!",
	// 	flags: ["nextjs","tailwindcss","typescript","opengl","threejs"]
	// }

	async function refreshProjs() {
		projs = await GetProjs("");
	}

	onMount(async () => {
		refreshProjs();
	})
</script>


<div>
	<Navbar />
	<ProjSide bind:toHide={hideSidePage} bind:newTitle={newTitle} bind:newLink={newLink} bind:newSummary={newSummary} bind:newFlags={newFlags} refreshProjs={refreshProjs}/>

  	<div class='w-[100%] my-[4vh] flex flex-col justify-center items-center p-3 relative'>
		<img src={ProjImg} alt="proj display">
		<p class='text-neutral-200 mt-5'>Welcome to the projects page!</p>

		<div class='absolute left-0 bottom-[10vh] rotate-[30deg] z-0 w-[48vw] min-w-[200px] h-[14vh] -ml-[28vh] rounded-full blur-[10vh] bg-green-800'></div>
		<div class='absolute left-0 bottom-0 rotate-[30deg] z-0 w-[20vw] h-[10vh] -ml-[7vh] rounded-full blur-[7vh] bg-green-600'></div>
  	</div>


  	<div class='p-3 w-[100%] flex gap-3 justify-center static'>
		<input type="text" bind:value={searchText} placeholder='Search or scroll!' class='w-[60vw] rounded-full py-3 px-4 text-black z-10'/>
		<button onclick={async () => {
			  projs = await GetProjs(searchText);
		}} class='bg-blue-500 hover:bg-blue-400 text-white px-3 rounded-[10px]'>Search</button>
		<button
			id="openBtn"
			onclick={() => {
			newTitle = ""
			newLink = ""
			newSummary = ""
			newFlags = ""
			if (hideSidePage) hideSidePage = false;
		}} class='bg-green-500 hover:bg-green-400 text-white px-3 rounded-[10px]'
	  	>New Project</button>
  	</div>
	
	<div class="max-w-[100vw] p-[80px] flex flex-wrap justify-center gap-x-[40px] gap-y-[80px]">
		{#each projs as proj}
			<div class='w-[100%] sm:w-auto h-fit px-[7vw] py-3 sm:p-3 flex justify-center'>
				<div class='w-[100%] sm:w-[450px] h-[400px] sm:h-[350px] bg-white rounded-[30px] shadow-md p-5 relative'>
					{#if proj.link != undefined}
						<a href={proj.link}><p class='text-[25px]'><b>{proj.title}</b></p></a><br/>
					{:else}
						<p class='text-[25px]'><b>{proj.title}</b></p><br/>
					{/if}
					<p>{proj.summary}</p>
					<div class='absolute bottom-[20px] left-0 h-[10vw] max-h-[50px] w-[100%] px-5 flex justify-around'>
						{#each proj.flags as flag}
							{#await import(`$lib/public/flags/${flag}.svg`) then { default: src }}
								<img {src} alt={flag} />
							{/await}
						{/each}
					</div>

					<button onclick={async () => {
						newTitle = proj.title;
						newLink = proj.link == undefined ? "" : proj.link;
						newSummary = proj.summary;
						newFlags = proj.flags == undefined ? "" : JSON.stringify(proj.flags);
						hideSidePage = false;
					}} class="w-[35px] h-[35px] absolute -bottom-[50px] left-[50%] -translate-x-[150%] hover:opacity-75">
						<img src={EditImg} alt="A Pen">
					</button>
					<button onclick={async () => {
						if (confirmDelete == proj.title) {
							await DeleteProj(proj.title);
							await refreshProjs();
							confirmDelete = "";
						} else {
							confirmDelete = proj.title;
						}
					}} class="w-[35px] h-[35px] absolute -bottom-[50px] left-[50%] translate-x-[50%] hover:opacity-75">
						{#if confirmDelete == proj.title}
							<img src={CheckImg} alt="A Check Mark">
						{:else}
							<img src={TrashImg} alt="A Trash Bin">
						{/if}
					</button>
				</div>
			</div>
		{/each}
		{#if projs.length == 0}
			<p class='text-neutral-300 text-3xl'>No Results</p>
		{/if}
	</div>
</div>