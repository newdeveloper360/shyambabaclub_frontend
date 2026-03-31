import Repository from "./Repository";

function getBonusReport(payload) {
  return Repository.get(
    `/get-bonus-report?page=${payload.page}`
  );
}

export { getBonusReport };
