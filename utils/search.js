class SearchCampaigns {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  searchByOrigin() {
    const keyword = this.queryStr
      ? {
          'startLocation': {
            $regex: this.queryStr,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  searchByDestination() {
    const keyword = this.queryStr
      ? {
          'endingLocation': {
            $regex: this.queryStr,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
}

module.exports = SearchCampaigns;
