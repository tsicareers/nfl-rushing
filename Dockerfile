FROM ruby:3.0.3
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
RUN mkdir /app
WORKDIR /app
COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
RUN bundle install
EXPOSE 3000

CMD ["rails", "server", "-p", "3000", "-b", "0.0.0.0"]