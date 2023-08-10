pnpm build

rsync -r -z -t -P dist/* root@qianyi-web:/opt/front-end/ad-service
