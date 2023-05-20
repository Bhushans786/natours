
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete queryObj[field]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/, match => `$${match}`);
        // Query building
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        let sortBy = '-createdAt';
        // console.log('sort: ', this.queryString.sort);
        if (this.queryString.sort) {
            sortBy = this.queryString.sort.split(',').join(' ');
        }
        // Query building
        this.query = this.query.sort(sortBy);
        return this;
    }

    limitFields() {
        let fields = '-__v';
        if (this.queryString.fields) {
            fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        // Query building
        this.query = this.query.select(fields);
        return this;
    }

    paginate() {
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 5;
        const skip = (page - 1) * limit;
        // Query building
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;