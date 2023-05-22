<script lang='ts'>
  // The ordering of these imports is critical to your app working properly
  import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
  // If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
  import '@skeletonlabs/skeleton/styles/all.css';
  // Most of your app wide CSS should be put in this file
  import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>

	<!-- Router Slot -->
  <div class="p-24">
    <slot />
  </div>
	<!-- ---- / ---- -->
	<svelte:fragment slot="footer">
    <div class="flex justify-center p-4 text-lg ">
      © 2012-2023 Jakob Tormalm 
    </div>
  </svelte:fragment>
</AppShell>