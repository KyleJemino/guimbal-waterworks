ARG ELIXIR_VERSION=1.17.3
ARG OTP_VERSION=27.3
ARG ALPINE_VERSION=3.20.6

ARG IMAGE="hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-alpine-${ALPINE_VERSION}"

FROM ${IMAGE}

# dev arguments
ARG USER_ID
ARG GROUP_ID

# set up dev user
RUN addgroup --gid ${GROUP_ID} user && \
    adduser --disabled-password --ingroup user --uid ${USER_ID} user

# install dev dependencies
# nodejs
RUN apk add --no-cache --repository=https://dl-cdn.alpinelinux.org/alpine/v3.16/main nodejs=16.20.2-r0 build-base inotify-tools git yarn

# switch to dev user
USER user

# switch to dev dir
WORKDIR /home/user/app

# install hex + rebar
RUN mix do local.hex --force, local.rebar --force
