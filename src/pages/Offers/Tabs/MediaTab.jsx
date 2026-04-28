import { TabPanel } from "@headlessui/react";
import Fileinput from "@/components/ui/Fileinput";

export default function MediaTab({ files, setFiles ,t}) {
  return (
       <TabPanel>
            <div className="space-y-6">
              {/* MAIN IMAGE */}
              <div>
                <Fileinput
                  label={t("addOfferPage.images.mainImage")}
                  selectedFile={files.mainImage}
                  onChange={(e) =>
                    setFiles({ ...files, mainImage: e.target.files[0] })
                  }
                />
              </div>

              {/* MULTI IMAGES */}
              <div>
                <Fileinput
                  label={t("addOfferPage.images.images")}
                  multiple
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    setFiles({
                      ...files,
                      images: [...files.images, ...newFiles],
                    });
                  }}
                />

                <div className="mt-2 space-y-2">
                  {files.images.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-slate-50 p-2 rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <button
                        onClick={() =>
                          setFiles({
                            ...files,
                            images: files.images.filter((_, i) => i !== index),
                          })
                        }
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* DOCUMENT FILES */}
              <div>
                <Fileinput
                  label={t("addOfferPage.documents")}
                  multiple
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    setFiles({
                      ...files,
                      files: [...files.files, ...newFiles],
                    });
                  }}
                />

                <div className="mt-2 space-y-2">
                  {files.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-slate-50 p-2 rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <button
                        onClick={() =>
                          setFiles({
                            ...files,
                            files: files.files.filter((_, i) => i !== index),
                          })
                        }
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* VIDEO FILES */}
              <div>
                <Fileinput
                  label={t("addOfferPage.videoFiles")}
                  multiple
                  accept="video/*"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    setFiles({
                      ...files,
                      videoFiles: [...files.videoFiles, ...newFiles],
                    });
                  }}
                />

                <div className="mt-2 space-y-2">
                  {files.videoFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-slate-50 p-2 rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <button
                        onClick={() =>
                          setFiles({
                            ...files,
                            videoFiles: files.videoFiles.filter(
                              (_, i) => i !== index,
                            ),
                          })
                        }
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabPanel>
  );
}