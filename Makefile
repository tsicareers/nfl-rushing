.PHONY: build
build:
	docker-compose build
	docker-compose run app scripts/wait-for-it.sh db:5432 -- "rake db:create db:migrate"

.PHONY: start
start:
	docker-compose up -d app

.PHONY: stop
stop:
	docker-compose down

.PHONY: webpack_compile
webpack_compile:
	docker-compose run app yarn && rm -rf /app/public/packs && bin/webpack

.PHONY: cleanup
cleanup:
	docker-compose run app rubocop -a

.PHONY: seed_db
seed_db:
	docker-compose run app scripts/wait-for-it.sh db:5432 -- "rake db:seed"