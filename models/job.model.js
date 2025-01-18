const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    jobTitle: String,
    companyName: String,
    location: String,
    jobType: {
      type: String,
      enum: [
        'Full-time(On-site)',
        'Part-time(On-site)',
        'Full-time(Remote)',
        'Part-time(Remote)',
      ],
    },
    salary: Number,
    jobDescription: String,
    qualification: [{ type: String }],
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
