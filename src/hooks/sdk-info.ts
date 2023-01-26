import { useRef } from 'react';

import { getVersion, getCommitHash } from '../lib';

const useSDKInfo = () => {
  const version = useRef(getVersion());
  const commit = useRef(getCommitHash());

  return {
    version: version.current,
    commit: commit.current,
  };
};

export { useSDKInfo };
