<script lang="ts">
  import { onDestroy } from 'svelte';
  import { mount } from 'svelte';
  import { shuffle } from 'lodash-es';
  import {
    SpatialRoot,
    SpatialNode,
    Focusable,
    setFocus,
    type FocusableComponentLayout,
    type FocusDetails,
    type KeyPressDetails
  } from '@noriginmedia/norigin-spatial-navigation-svelte';

  // ─── Data ────────────────────────────────────────────────────

  const rows = shuffle([
    { title: 'Recommended' },
    { title: 'Movies' },
    { title: 'Series' },
    { title: 'TV Channels' },
    { title: 'Sport' }
  ]);

  const assets = [
    { title: 'Asset 1', color: '#714ADD' },
    { title: 'Asset 2', color: '#AB8DFF' },
    { title: 'Asset 3', color: '#512EB0' },
    { title: 'Asset 4', color: '#714ADD' },
    { title: 'Asset 5', color: '#AB8DFF' },
    { title: 'Asset 6', color: '#512EB0' },
    { title: 'Asset 7', color: '#714ADD' },
    { title: 'Asset 8', color: '#AB8DFF' },
    { title: 'Asset 9', color: '#512EB0' }
  ];

  // ─── Content State ───────────────────────────────────────────

  let selectedAsset: { title: string; color: string } | null = $state(null);
  let scrollingRowsEl: HTMLDivElement;

  function onAssetPress(props: { title: string; color: string }, _details: KeyPressDetails) {
    selectedAsset = props;
  }

  function onRowFocus(layout: FocusableComponentLayout, _props: any, _details: FocusDetails) {
    scrollingRowsEl?.scrollTo({ top: layout.y, behavior: 'smooth' });
  }

  // ─── Progress Bar State ──────────────────────────────────────

  const DEFAULT_PERCENT = 10;
  const SEEK_PERCENT = 10;
  const DELAY_MS = 100;

  let percent = $state(DEFAULT_PERCENT);
  let progressFocused = $state(false);
  let timer: ReturnType<typeof setInterval> | null = null;

  $effect(() => {
    if (!progressFocused) {
      percent = DEFAULT_PERCENT;
    }
  });

  onDestroy(() => {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  });

  function handleArrowPress(direction: string): boolean {
    if (direction === 'right' && timer === null) {
      timer = setInterval(() => {
        percent = Math.min(100, percent + SEEK_PERCENT);
      }, DELAY_MS);
    }
    return true;
  }

  function handleArrowRelease(direction: string): void {
    if (direction === 'right' && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }
</script>

<SpatialRoot
  debug={false}
  visualDebug={false}
  distanceCalculationMethod="center"
  initialFocusKey="MENU"
  onUtterText={(text) => console.log('onUtterText', text)}
>
  <div class="app-container">

    <!-- ─── Menu ──────────────────────────────────────────────── -->
    <SpatialNode navKey="MENU" saveLastFocusedChild={false} trackChildren forceFocus>
      {#snippet children({ hasFocusedChild, spatial })}
        <div use:spatial class="menu" class:has-focused-child={hasFocusedChild}>
          <div class="logo-placeholder">NM</div>
          {#each Array(5) as _}
            <SpatialNode>
              {#snippet children({ focused, spatial: itemSpatial })}
                <div use:itemSpatial class="menu-item" class:focused></div>
              {/snippet}
            </SpatialNode>
          {/each}
        </div>
      {/snippet}
    </SpatialNode>

    <!-- ─── Content ───────────────────────────────────────────── -->
    <SpatialNode navKey="CONTENT">
      {#snippet children({ spatial })}
        <div use:spatial class="content-wrapper">
          <div class="content-title">Norigin Spatial Navigation</div>

          <div class="selected-item-wrapper">
            <div
              class="selected-item-box"
              style:background-color={selectedAsset?.color ?? '#565b6b'}
            ></div>
            <div class="selected-item-title">
              {selectedAsset?.title ?? 'Press "Enter" to select an asset'}
            </div>

            <!-- Progress Bar -->
            <SpatialNode
              bind:focused={progressFocused}
              onArrowPress={handleArrowPress}
              onArrowRelease={handleArrowRelease}
            >
              {#snippet children({ focused: pFocused, spatial: pSpatial })}
                <div use:pSpatial class="progress-wrapper" class:focused={pFocused}>
                  <div class="progress-bar" class:focused={pFocused} style:width="{percent}%"></div>
                </div>
              {/snippet}
            </SpatialNode>
          </div>

          <div class="scrolling-rows" bind:this={scrollingRowsEl}>
            <div>
              {#each rows as row (row.title)}
                {@const isShuffleSize = Math.random() < 0.5}
                <SpatialNode navKey={`row-${row.title}`} accessibilityLabel={row.title} onFocus={onRowFocus}>
                  {#snippet children({ spatial: rowSpatial })}
                    {@const scrollingEl = { current: null as HTMLDivElement | null }}
                    <div use:rowSpatial class="content-row">
                      <div class="row-title">{row.title}</div>
                      <div class="scrolling-wrapper" bind:this={scrollingEl.current}>
                        <div class="scrolling-content">
                          {#each assets as asset, index (asset.title)}
                            <SpatialNode
                              accessibilityLabel={asset.title}
                              onEnterPress={onAssetPress}
                              extraProps={{ title: asset.title, color: asset.color }}
                              onFocus={(layout) => { scrollingEl.current?.scrollTo({ left: layout.x, behavior: 'smooth' }); }}
                            >
                              {#snippet children({ focused: aFocused, spatial: aSpatial })}
                                <div use:aSpatial class="asset-wrapper">
                                  <div
                                    class="asset-box"
                                    class:focused={aFocused}
                                    style:width={isShuffleSize ? `${80 + index * 30}px` : '225px'}
                                    style:background-color={asset.color}
                                  ></div>
                                  <div class="asset-title">{asset.title}</div>
                                </div>
                              {/snippet}
                            </SpatialNode>
                          {/each}
                        </div>
                      </div>
                    </div>
                  {/snippet}
                </SpatialNode>
              {/each}
            </div>
          </div>
        </div>
      {/snippet}
    </SpatialNode>

  </div>
</SpatialRoot>

<style>
  :global(html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center, dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend, table, caption,
  tbody, tfoot, thead, tr, th, td, article, aside,
  canvas, details, embed, figure, figcaption,
  footer, header, hgroup, menu, nav, output,
  ruby, section, summary, time, mark, audio, video) {
    margin: 0;
    padding: 0;
    border: 0;
  }

  :global(::-webkit-scrollbar) {
    display: none;
  }

  .app-container {
    background-color: #221c35;
    width: 1440px;
    height: 810px;
    display: flex;
    flex-direction: row;
  }

  /* ─── Menu ─────────────────────────────────────────────── */

  .menu {
    flex: 1;
    max-width: 246px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #362c56;
    padding-top: 37px;
  }

  .menu.has-focused-child {
    background-color: #4e4181;
  }

  .logo-placeholder {
    height: 57px;
    width: 175px;
    margin-bottom: 51px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 32px;
    font-weight: bold;
    font-family: 'Segoe UI', sans-serif;
  }

  .menu-item {
    width: 171px;
    height: 51px;
    background-color: #b056ed;
    border: 0 solid white;
    box-sizing: border-box;
    border-radius: 7px;
    margin-bottom: 37px;
  }

  .menu-item.focused {
    border-width: 6px;
  }

  /* ─── Content ──────────────────────────────────────────── */

  .content-wrapper {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .content-title {
    color: white;
    font-size: 48px;
    font-weight: 600;
    font-family: 'Segoe UI', sans-serif;
    text-align: center;
    margin-top: 52px;
    margin-bottom: 37px;
  }

  .selected-item-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .selected-item-box {
    height: 282px;
    width: 1074px;
    margin-bottom: 37px;
    border-radius: 7px;
  }

  .selected-item-title {
    position: absolute;
    bottom: 75px;
    left: 100px;
    color: white;
    font-size: 27px;
    font-weight: 400;
    font-family: 'Segoe UI', sans-serif;
  }

  .scrolling-rows {
    overflow-y: auto;
    overflow-x: hidden;
    flex-shrink: 1;
    flex-grow: 1;
  }

  /* ─── Content Row ──────────────────────────────────────── */

  .content-row {
    margin-bottom: 37px;
  }

  .row-title {
    color: white;
    margin-bottom: 22px;
    font-size: 27px;
    font-weight: 700;
    font-family: 'Segoe UI', sans-serif;
    padding-left: 60px;
  }

  .scrolling-wrapper {
    overflow-x: auto;
    overflow-y: hidden;
    flex-shrink: 1;
    flex-grow: 1;
    padding-left: 60px;
  }

  .scrolling-content {
    display: flex;
    flex-direction: row;
  }

  /* ─── Asset ────────────────────────────────────────────── */

  .asset-wrapper {
    margin-right: 22px;
    display: flex;
    flex-direction: column;
  }

  .asset-box {
    height: 127px;
    border: 0 solid white;
    box-sizing: border-box;
    border-radius: 7px;
  }

  .asset-box.focused {
    border-width: 6px;
  }

  .asset-title {
    color: white;
    margin-top: 10px;
    font-family: 'Segoe UI', sans-serif;
    font-size: 24px;
    font-weight: 400;
  }

  /* ─── Progress Bar ─────────────────────────────────────── */

  .progress-wrapper {
    position: absolute;
    bottom: 95px;
    right: 100px;
    width: 540px;
    height: 24px;
    background-color: gray;
    border-radius: 21px;
    border: 0 solid white;
    box-sizing: border-box;
  }

  .progress-wrapper.focused {
    border-width: 6px;
  }

  .progress-bar {
    height: 100%;
    background-color: dodgerblue;
    border-radius: 21px;
  }

  .progress-bar.focused {
    background-color: deepskyblue;
  }
</style>
