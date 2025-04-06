ARG ELIXIR_VERSION=1.17.3
ARG OTP_VERSION=27.3
ARG UBUNTU_VERSION=jammy-20250126

ARG IMAGE="hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-ubuntu-${UBUNTU_VERSION}"

FROM ${IMAGE}

# dev arguments
ARG USER_ID
ARG GROUP_ID
SHELL ["/bin/bash", "--login", "-c"]

# set up dev user
RUN addgroup --gid ${GROUP_ID} user && \
    adduser --disabled-password --ingroup user --uid ${USER_ID} user

# nodejs
RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN nvm install v16.20.2-r0

RUN apt update
RUN apt install inotify-tools git yarn

# switch to dev user
USER user

# switch to dev dir
WORKDIR /home/user/app

# install hex + rebar
RUN mix do local.hex --force, local.rebar --force
