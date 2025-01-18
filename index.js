const express = require('express');
const { initializeDatabase } = require('./db/db.connect');
const Job = require('./models/job.model');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
initializeDatabase();

app.use(express.json());
app.listen(PORT, () => console.log(`Servre is listening on port ${PORT}`));

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

async function addJob(newJob) {
  try {
    const job = new Job(newJob);
    const saveJob = await job.save();
    return saveJob;
  } catch (error) {
    console.log(error);
  }
}

app.post('/jobs', async (req, res) => {
  try {
    const savedJob = await addJob(req.body);
    res
      .status(201)
      .json({ message: 'Job post created successfully', job: savedJob });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a job' });
  }
});

async function getAllJobs() {
  try {
    const allJobs = await Job.find();
    return allJobs;
  } catch (error) {
    console.log(error);
  }
}

app.get('/jobs', async (req, res) => {
  try {
    const allJobs = await getAllJobs();
    if (allJobs.length > 0) {
      res.json(allJobs);
    } else {
      res
        .status(404)
        .json({ error: 'No jobs found. Please create a job post.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get all jobs.' });
  }
});

async function getJobById(jobId) {
  try {
    const job = await Job.findOne({ _id: jobId });
    return job;
  } catch (error) {
    console.log(error);
  }
}

app.get('/jobs/:jobId', async (req, res) => {
  try {
    const job = await getJobById(req.params.jobId);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ error: 'No job found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get a job post' });
  }
});

async function getJobByTitle(title) {
  try {
    const job = await Job.findOne({ jobTitle: title });
    return job;
  } catch (error) {
    console.log(error);
  }
}

app.get('/jobs/search/:title', async (req, res) => {
  try {
    const title = req.params.title;

    const jobs = await Job.find();
    const filteredJobs = jobs.filter((job) =>
      job.jobTitle.toLowerCase().includes(title.toLowerCase())
    );

    if (filteredJobs.length === 0) {
      res.status(404).json({ error: `No ${title} job found` });
    } else {
      res.status(200).json(filteredJobs);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get a job by its title' });
  }
});

async function deleteJob(jobId) {
  try {
    const job = await Job.findByIdAndDelete(jobId);
    return job;
  } catch (error) {
    console.log(error);
  }
}

app.delete('/jobs/:jobId', async (req, res) => {
  try {
    const deletedJob = await deleteJob(req.params.jobId);
    if (deletedJob) {
      res.status(200).json({ message: 'Job post deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete a job post' });
  }
});

async function updateJob(jobId, dataToUpdate) {
  try {
    const job = await Job.findByIdAndUpdate(jobId, dataToUpdate, { new: true });
    return job;
  } catch (error) {
    console.log(error);
  }
}

app.put('/jobs/:jobId', async (req, res) => {
  try {
    const updatedPost = await updateJob(req.params.jobId, req.body);
    if (updatedPost) {
      res
        .status(200)
        .json({ message: 'Job post updated successfully', job: updatedPost });
    } else {
      res.status(404).json({ error: 'No job post found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update a job post' });
  }
});
