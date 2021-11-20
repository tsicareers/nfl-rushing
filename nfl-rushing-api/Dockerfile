FROM ruby:3.0.2

RUN apt-get update -qq && apt-get install --no-install-recommends -y build-essential libpq-dev libsqlite3-dev sqlite3

LABEL Name=ecommerceapi Version=0.0.1

EXPOSE 3000

WORKDIR /app
COPY . /app

RUN bundle install

CMD ["rails", "server", "-b", "0.0.0.0"]

