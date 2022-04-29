# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# [1.0.3]
## Added
- Added focusable component callbacks to the effect that updates them in `SpatialNavigation` service. Otherwise only
the first closure is assigned to the service and is always called with the initial props.

# [1.0.2]
## Changed
- Changed `measureLayout` back to calculate coords based on `offsetTop/Left/Width/Height` instead of `getClientBoundRect`.
The reason is that `getClientBoundRect` is less performant and calculates coordinates AFTER all the CSS transformations,
which is undesirable for scaled or transformed elements.

# [1.0.1]
## Changed
- Updated Github path in `package.json`

# [1.0.0]
## Changed
- Migrated the old [HOC library](https://github.com/NoriginMedia/react-spatial-navigation) to Hooks.
