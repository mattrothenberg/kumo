export function loader() {
  return Response.json({
    version: __BUILD_VERSION__,
    commit: __BUILD_COMMIT__,
    commitDate: __BUILD_COMMIT_DATE__,
    branch: __BUILD_BRANCH__,
    buildDate: __BUILD_DATE__,
  });
}
