const { Document, Application, Version, Export, Template } = require("../models");

async function getStats(req, res) {
  try {
    const userId = req.user.id;

    // 1. Fetch counts
    const documentsCount = await Document.count({ where: { userId } });
    
    const applicationsCount = await Application.count({ where: { userId } });

    const versionsCount = await Version.count({
      include: [{
        model: Document,
        where: { userId },
        required: true,
        attributes: []
      }]
    });

    const exportsCount = await Export.count({
      include: [{
        model: Document,
        where: { userId },
        required: true,
        attributes: []
      }]
    });

    // 2. Fetch recent documents (limit 3, sorted by updatedAt DESC)
    const recentDocuments = await Document.findAll({
      where: { userId },
      order: [["updatedAt", "DESC"]],
      limit: 3,
      include: [{
        model: Template,
        attributes: ["name"],
        required: false
      }]
    });

    // 3. Fetch application status breakdown for pipeline progress bars
    const statuses = ["saved", "applied", "interview", "offer", "rejected"];
    const pipelineCounts = await Promise.all(
      statuses.map(status =>
        Application.count({
          where: { userId, status }
        })
      )
    );

    const applicationPipeline = {};
    statuses.forEach((status, index) => {
      applicationPipeline[status] = pipelineCounts[index];
    });

    res.send({
      success: true,
      data: {
        counts: {
          documents: documentsCount,
          applications: applicationsCount,
          versions: versionsCount,
          exports: exportsCount
        },
        recentDocuments,
        applicationPipeline
      }
    });

  } catch (error) {
    console.error("Error in getStats:", error);
    res.status(500).send({
      success: false,
      message: "Server error occurred while fetching dashboard statistics."
    });
  }
}

module.exports = { getStats };
