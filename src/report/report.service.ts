import { Injectable } from '@nestjs/common';
import { data, ReportType } from '../data';
import { v4 as uuid } from 'uuid';
import { ReportResponseDto } from '../dtos/report.dto';

interface Report {
  amount: number;
  source: string;
}

@Injectable()
export class ReportService {
  getAllReports(type: ReportType): ReportResponseDto[] {
    return data.report
      .filter((report) => report.type === type)
      .map((report) => new ReportResponseDto(report));
  }

  getReportById(type: ReportType, id: string): ReportResponseDto {
    const report = data.report.find(
      (report) => report.id === id && report.type === type,
    );

    if (!report) return;

    return new ReportResponseDto(report);
  }

  createReport(type: ReportType, body: Report): ReportResponseDto {
    const newReport = {
      id: uuid(),
      created_at: new Date(),
      updated_at: new Date(),
      type,
      ...body,
    };

    data.report.push(newReport);

    return new ReportResponseDto(newReport);
  }

  updateReport(
    type: ReportType,
    id: string,
    body: Partial<Report>,
  ): ReportResponseDto {
    const reportToUpdate = data.report.find(
      (report) => report.id === id && report.type === type,
    );

    if (!reportToUpdate) {
      return;
    } else {
      const reportIndex = data.report.findIndex(
        (report) => report.id === reportToUpdate.id,
      );

      data.report[reportIndex] = {
        ...data.report[reportIndex],
        ...body,
      };

      return new ReportResponseDto(data.report[reportIndex]);
    }
  }

  deleteReport(id: string) {
    const reportIndex = data.report.findIndex((report) => report.id === id);

    if (reportIndex === -1) {
      return {
        message: 'Return not found',
      };
    } else {
      data.report.splice(reportIndex, 1);
    }
  }
}
