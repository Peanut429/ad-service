pnpm build

rsync -r -z -t -P dist/* root@8.141.89.183:/opt/front-end/ad-service
