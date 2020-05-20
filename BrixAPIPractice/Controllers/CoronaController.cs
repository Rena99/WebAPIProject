using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace BrixAPIPractice.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CoronaController : ControllerBase
    {
        public string JSONPath = @"C:\Users\rina lerner\Documents\Brix\BrixAPIPractice\BrixAPIPractice\BrixAPIPractice\CaronaData.json";

        [HttpGet("{id:int}")]
        public Path[] Get(int id)
        {
            var json = System.IO.File.ReadAllText(JSONPath);
            var jObject = JObject.Parse(json);
            JArray patients = (JArray)jObject["Patients"];
            try
            {
                Patient patient;
                if (patients.Count>0)
                {
                    foreach (var item in patients)
                    {
                        if (int.Parse(item["ID"].ToString()) == id)
                        {
                            JArray pathsArrary = (JArray)item["Paths"];
                            patient = new Patient(pathsArrary.Count);
                            patient.ID = int.Parse(item["ID"].ToString());
                            Path path = new Path();
                            int i = 0;
                            foreach (var Pitem in pathsArrary)
                            {
                                patient.Paths[i++]=new Path
                                {
                                    StartDate = Convert.ToDateTime(Pitem["StartDate"].ToString()),
                                    EndDate = Convert.ToDateTime(Pitem["EndDate"].ToString()),
                                    City = Pitem["City"].ToString(),
                                    Location = Pitem["Location"].ToString()
                                };
                            }
                            return patient.Paths;
                        }
                    }

                }
                try
                {

                    patient = new Patient(0);
                    patient.ID = id;
                    JToken JsonResult = JObject.Parse(JsonConvert.SerializeObject(patient));
                    patients.Add(JsonResult);
                    jObject["Patients"] = patients;
                    string newJsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(jObject, Newtonsoft.Json.Formatting.Indented);
                    System.IO.File.WriteAllText(JSONPath, newJsonResult);
                    return patient.Paths;
                }
                catch
                {
                    return null;
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost("{id:int}")]
        public Path[] Post(int id, Path[] path)
        {
            var json = System.IO.File.ReadAllText(JSONPath);
            var jObject = JObject.Parse(json);
            JArray patients = (JArray)jObject["Patients"];
            try
            {
                Patient patient;
                if (patients.Count > 0)
                {
                    foreach (var item in patients)
                    {
                        if (int.Parse(item["ID"].ToString()) == id)
                        {
                            JArray paths = (JArray)item["Paths"];
                            int i = 0;
                            patient = new Patient(path.Length);
                            patient.ID = int.Parse(item["ID"].ToString());
                            patients.Remove(item);
                            foreach (var Pitem in path)
                            {
                                patient.Paths[i++] = Pitem;
                            }
                            JToken JsonResult = JObject.Parse(JsonConvert.SerializeObject(patient));
                            patients.Add(JsonResult);
                            jObject["Patients"] = patients;
                            string newJsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(jObject, Newtonsoft.Json.Formatting.Indented);
                            System.IO.File.WriteAllText(JSONPath, newJsonResult);
                            return path;
                        }
                    }
                }
                return null;
            }
            catch(Exception e)
            {
                return null;
            }
        }
    }
}