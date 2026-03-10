---
sidebar_position: 1
---

# Norigin Spatial Navigation

Norigin Spatial Navigation is an open-source React library that enables directional (arrow-key / remote-control) navigation between focusable UI elements. It automatically determines which component to focus next based on spatial position on screen, making it ideal for Smart TV apps, set-top boxes, and any browser application driven by a remote or keyboard.

## Supported Platforms

| Platform               | Devices                                                |
| ---------------------- | ------------------------------------------------------ |
| Web Browsers           | Chrome, Firefox, and other modern browsers             |
| Smart TVs              | Samsung Tizen, LG WebOS, Hisense Vidaa                 |
| Connected TV devices   | Chromium, Ekioh, or WebKit browser-based set-top boxes |
| React Native (limited) | Android TV, Apple TV                                   |

## Packages

| Package                                          | Description             | Use when                                  |
| ------------------------------------------------ | ----------------------- | ----------------------------------------- |
| `@noriginmedia/norigin-spatial-navigation-react` | React hooks bindings    | Building React apps (recommended)         |
| `@noriginmedia/norigin-spatial-navigation-core`  | Core service, no React  | Framework-agnostic or custom integrations |
| `@noriginmedia/norigin-spatial-navigation`       | Combined legacy package | Upgrading from older versions             |
