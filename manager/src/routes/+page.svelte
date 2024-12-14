<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Contruct from '$lib/public/construct.png';
</script>

<div>
	<Navbar />

	<div class="flex justify-center items-center bg-black py-7">
		<p class="text-white text-[70px] mr-[50px]">
			Hello,<br>
			<span class="text-[64px] ml-[100px] text-neutral-400">Evan!</span>
		</p>
		<img src={Contruct} alt="Construction Evan">
	</div>

	<div class='text-neutral-200 p-[20px] border-green-500 border-2 rounded-[15px] bg-black mx-[5vw] mt-[20vh]'>
		<div class='mb-[20px]'>
			<p class='text-white text-[36px]'><b>HomePages Manager</b></p>
			<hr class='border-neutral-700'/>
		</div>
		<p class="text-lg">
			In case this isn't Evan: this is the tool I'm using for managing the experiences, projects, and blogs of my resume website. Unless you have access to my database,
			you probably won't see anything once you navigate to any of the tabs in the top right.
		</p>
	</div>

	<p class="text-white text-2xl text-center mt-5 mb-[20vh]">Go ahead on click on one of the tabs above!</p>
</div>