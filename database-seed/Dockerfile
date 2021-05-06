FROM mongo:4

WORKDIR /var/dmongo
COPY . /var/dmongo

CMD mongoimport --host mongo-db -d maid-db -c users --drop --type json --file /var/dmongo/users.json --jsonArray && mongoimport --host mongo-db -d maid-db -c maids --drop --type json --file /var/dmongo/maids.json --jsonArray && mongoimport --host mongo-db -d maid-db -c wallets --drop --type json --file /var/dmongo/wallets.json --jsonArray