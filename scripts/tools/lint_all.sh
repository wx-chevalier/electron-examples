#!/bin/bash
set -ex

(cd ./packages/rte-core && yarn lint)
(cd ./packages/rte-bootstrap && yarn lint)
(cd ./packages/rte-components && yarn lint)
(cd ./packages/rte-host-app && yarn lint)

