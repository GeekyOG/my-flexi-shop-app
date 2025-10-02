#!/bin/bash
# Reset Metro, Expo, and clear caches for a clean NativeWind/Expo run
rm -rf node_modules/.cache
rm -rf .expo
rm -rf .next
watchman watch-del-all || true
npm start -- --clear
